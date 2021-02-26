// modified from: https://github.com/atomiks/tippyjs/blob/3d7e03ab8c079259e931a7b8349d838c039659af/src/addons/delegate.ts
// also see: https://github.com/atomiks/tippyjs/issues/912

import tippy, { Instance, Props, Targets } from 'tippy.js';
const TOUCH_OPTIONS = { passive: true, capture: true };
const { defaultProps } = tippy;
interface ListenerObject {
  node: Element;
  eventType: string;
  handler: EventListenerOrEventListenerObject;
  options: boolean | object;
}
function normalizeToArray<T>(value: T | T[]): T[] {
  return ([] as T[]).concat(value);
}
function removeProperties<T>(obj: T, keys: string[]): Partial<T> {
  const clone = { ...obj };
  keys.forEach((key) => {
    delete (clone as any)[key];
  });
  return clone;
}

const BUBBLING_EVENTS_MAP = {
  mouseover: 'mouseenter',
  focusin: 'focus',
  click: 'click',
};

/**
 * Creates a delegate instance that controls the creation of tippy instances
 * for child elements (`target` CSS selector).
 */
function delegate(
  targets: Targets,
  props: Partial<Props> & {
    target: string;
    getTargetProps(target: Element): Partial<Props> | undefined;
  }
): Instance {
  let listeners: ListenerObject[] = [];
  let childTippyInstances: Instance[] = [];
  let disabled = false;

  const { target } = props;

  const nativeProps = removeProperties(props, ['target']);
  const parentProps = { ...nativeProps, trigger: 'manual', touch: false };
  const childProps = { ...nativeProps, showOnCreate: true };

  // @ts-ignore
  const returnValue = tippy(targets, parentProps);
  const normalizedReturnValue = normalizeToArray(returnValue);

  function onTrigger(event: Event): void {
    if (!event.target || disabled) {
      return;
    }

    const targetNode = (event.target as Element).closest(target);

    if (!targetNode) {
      return;
    }

    // Get relevant trigger with fallbacks:
    // 1. Check `data-tippy-trigger` attribute on target node
    // 2. Fallback to `trigger` passed to `delegate()`
    // 3. Fallback to `defaultProps.trigger`
    const trigger =
      targetNode.getAttribute('data-tippy-trigger') ||
      props.trigger ||
      defaultProps.trigger;

    // @ts-ignore
    if (targetNode._tippy) {
      return;
    }

    if (event.type === 'touchstart' && typeof childProps.touch === 'boolean') {
      return;
    }

    if (
      event.type !== 'touchstart' &&
      trigger.indexOf((BUBBLING_EVENTS_MAP as any)[event.type]) < 0
    ) {
      return;
    }

    const instance = tippy(targetNode, {
      ...childProps,
      ...props.getTargetProps(targetNode),
    });

    if (instance) {
      childTippyInstances = childTippyInstances.concat(instance);
    }
  }

  function on(
    node: Element,
    eventType: string,
    handler: EventListener,
    options: object | boolean = false
  ): void {
    node.addEventListener(eventType, handler, options);
    listeners.push({ node, eventType, handler, options });
  }

  function addEventListeners(instance: Instance): void {
    const { reference } = instance;

    on(reference, 'touchstart', onTrigger, TOUCH_OPTIONS);
    on(reference, 'mouseover', onTrigger);
    on(reference, 'focusin', onTrigger);
    on(reference, 'click', onTrigger);
  }

  function removeEventListeners(): void {
    listeners.forEach(
      ({ node, eventType, handler, options }: ListenerObject) => {
        node.removeEventListener(eventType, handler, options);
      }
    );
    listeners = [];
  }

  function applyMutations(instance: Instance): void {
    const originalDestroy = instance.destroy;
    const originalEnable = instance.enable;
    const originalDisable = instance.disable;

    instance.destroy = (shouldDestroyChildInstances = true): void => {
      if (shouldDestroyChildInstances) {
        childTippyInstances.forEach((instance) => {
          instance.destroy();
        });
      }

      childTippyInstances = [];

      removeEventListeners();
      originalDestroy();
    };

    instance.enable = (): void => {
      originalEnable();
      childTippyInstances.forEach((instance) => instance.enable());
      disabled = false;
    };

    instance.disable = (): void => {
      originalDisable();
      childTippyInstances.forEach((instance) => instance.disable());
      disabled = true;
    };

    addEventListeners(instance);
  }

  normalizedReturnValue.forEach(applyMutations);

  return returnValue;
}

export default delegate;

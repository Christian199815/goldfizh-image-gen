"use client";

import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

import { selectClassName } from "./FormField";

export type CustomSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type CustomSelectProps = {
  id: string;
  /** Id of the visible field label (FormField `id`), not the trigger. */
  labelledBy?: string;
  name?: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  "aria-describedby"?: string;
};

export function CustomSelect({
  id,
  labelledBy,
  name,
  value,
  options,
  onChange,
  disabled,
  placeholder = "Select…",
  "aria-describedby": ariaDescribedBy,
}: CustomSelectProps) {
  const labelReference = labelledBy ?? id;
  const listboxId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label ?? placeholder;

  const enabledOptions = options.filter((option) => !option.disabled);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  const selectValue = useCallback(
    (next: string) => {
      onChange(next);
      close();
    },
    [close, onChange],
  );

  const resolveActiveIndex = useCallback(() => {
    const selectedIndex = options.findIndex(
      (option) => option.value === value && !option.disabled,
    );
    return selectedIndex >= 0
      ? selectedIndex
      : options.findIndex((option) => !option.disabled);
  }, [options, value]);

  const openMenu = useCallback(() => {
    setActiveIndex(resolveActiveIndex());
    setOpen(true);
  }, [resolveActiveIndex]);

  const toggleMenu = useCallback(() => {
    setOpen((prev) => {
      if (prev) {
        setActiveIndex(-1);
        return false;
      }
      setActiveIndex(resolveActiveIndex());
      return true;
    });
  }, [resolveActiveIndex]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (
        triggerRef.current?.contains(target) ||
        listboxRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [close, open]);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }
    const rect = trigger.getBoundingClientRect();
    setMenuStyle({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updateMenuPosition();

    const handleReposition = () => updateMenuPosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, updateMenuPosition]);

  useLayoutEffect(() => {
    if (!open || activeIndex < 0 || !menuStyle) {
      return;
    }

    const activeOption = document.getElementById(
      `${listboxId}-option-${activeIndex}`,
    );
    if (!(activeOption instanceof HTMLElement)) {
      return;
    }

    if (document.activeElement === triggerRef.current) {
      activeOption.focus({ preventScroll: true });
      return;
    }

    if (listboxRef.current?.contains(document.activeElement)) {
      activeOption.focus({ preventScroll: true });
    }
  }, [activeIndex, listboxId, menuStyle, open]);

  const moveActive = (direction: 1 | -1) => {
    if (enabledOptions.length === 0) {
      return;
    }

    const enabledIndexes = options
      .map((option, index) => (!option.disabled ? index : -1))
      .filter((index) => index >= 0);

    const current =
      activeIndex >= 0
        ? enabledIndexes.indexOf(activeIndex)
        : enabledIndexes.indexOf(
            options.findIndex((option) => option.value === value),
          );

    const base = current >= 0 ? current : 0;
    const next =
      enabledIndexes[
        (base + direction + enabledIndexes.length) % enabledIndexes.length
      ];
    setActiveIndex(next);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          moveActive(1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          moveActive(-1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) {
          openMenu();
        } else if (activeIndex >= 0 && !options[activeIndex]?.disabled) {
          selectValue(options[activeIndex].value);
        }
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActiveIndex(
            enabledOptions.length
              ? options.findIndex((o) => o.value === enabledOptions[0].value)
              : -1,
          );
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          const last = enabledOptions[enabledOptions.length - 1];
          setActiveIndex(
            last ? options.findIndex((o) => o.value === last.value) : -1,
          );
        }
        break;
      default:
        break;
    }
  };

  const handleListboxKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (activeIndex >= 0 && !options[activeIndex]?.disabled) {
          selectValue(options[activeIndex].value);
        }
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(
          enabledOptions.length
            ? options.findIndex((o) => o.value === enabledOptions[0].value)
            : -1,
        );
        break;
      case "End":
        event.preventDefault();
        {
          const last = enabledOptions[enabledOptions.length - 1];
          setActiveIndex(
            last ? options.findIndex((o) => o.value === last.value) : -1,
          );
        }
        break;
      case "Tab":
        close();
        break;
      default:
        break;
    }
  };

  const listbox =
    open && menuStyle ? (
      <ul
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={labelReference}
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
        }
        onKeyDown={handleListboxKeyDown}
        style={{
          top: menuStyle.top,
          left: menuStyle.left,
          width: menuStyle.width,
        }}
        className="fixed z-50 max-h-56 overflow-auto rounded-lg border border-gf-panel-border bg-gf-panel p-1.5 shadow-lg shadow-black/10"
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          const isActive = index === activeIndex;

          const optionId = `${listboxId}-option-${index}`;

          return (
            <li key={option.value}>
              <button
                id={optionId}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                disabled={option.disabled}
                tabIndex={-1}
                onMouseEnter={() => {
                  if (!option.disabled) {
                    setActiveIndex(index);
                  }
                }}
                onClick={() => {
                  if (!option.disabled) {
                    selectValue(option.value);
                  }
                }}
                className={`flex w-full items-center rounded-md px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                  isSelected
                    ? "bg-gf-brand/10 font-medium text-gf-brand"
                    : isActive
                      ? "bg-gf-option text-gf-heading"
                      : "text-gf-heading hover:bg-gf-option"
                }`}
              >
                <span className="truncate">{option.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  return (
    <div className="relative -mx-1 px-1">
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={labelReference}
        aria-describedby={ariaDescribedBy}
        aria-activedescendant={
          open && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        onClick={() => {
          if (!disabled) {
            toggleMenu();
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        className={`${selectClassName} flex w-full items-center justify-between gap-3 pr-3 text-left`}
      >
        <span
          className={`min-w-0 flex-1 truncate ${
            selected ? "text-gf-heading" : "text-gf-text"
          }`}
        >
          {displayLabel}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gf-text transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {typeof document !== "undefined" && listbox
        ? createPortal(listbox, document.body)
        : null}
    </div>
  );
}

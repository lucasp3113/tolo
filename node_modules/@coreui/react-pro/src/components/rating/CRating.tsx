import React, {
  forwardRef,
  Fragment,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useId,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CTooltip } from '../tooltip'

type Icon = {
  [key: number]: JSX.Element
}

export interface CRatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * The default icon to display when the item is selected.
   */
  activeIcon?: string | JSX.Element | Icon
  /**
   * Enables the clearing upon clicking the selected item again.
   */
  allowClear?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * If enabled, only the currently selected icon will be visibly highlighted.
   */
  highlightOnlySelected?: boolean
  /**
   * The default icon to display when the item is not selected.
   */
  icon?: string | JSX.Element | Icon
  /**
   * Specifies the total number of stars to be displayed in the star rating component. This property determines the scale of the rating, such as out of 5 stars, 10 stars, etc.
   */
  itemCount?: number
  /**
   * The name attribute of the radio input elements.
   */
  name?: string
  /**
   * Execute a function when a user changes the selected element.
   */
  onChange?: (value: number | null) => void
  /**
   * Execute a function when a user hover the element.
   */
  onHover?: (value: number | null) => void
  /**
   * Minimum increment value change allowed.
   */
  precision?: number
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean
  /**
   * Size the component small, large, or custom if you define custom icons with custom height.
   */
  size?: 'sm' | 'lg' | 'custom'
  /**
   * Enable tooltips with default values or set specific labels for each icon.
   */
  tooltips?: boolean | string[]
  /**
   * The `value` attribute of component.
   *
   * @controllable onChange
   * */
  value?: number
}

const CConditionalTooltip = ({
  children,
  content,
  tooltip,
}: {
  children: ReactNode
  content?: ReactNode
  tooltip?: boolean
}) => {
  return tooltip ? (
    <CTooltip content={content}>
      <span>{children}</span>
    </CTooltip>
  ) : (
    children
  )
}

export const CRating = forwardRef<HTMLDivElement, CRatingProps>(
  (
    {
      activeIcon,
      allowClear,
      className,
      disabled,
      highlightOnlySelected,
      icon,
      itemCount = 5,
      name,
      onChange,
      onHover,
      precision = 1,
      readOnly,
      size,
      tooltips,
      value,
      ...rest
    },
    ref,
  ) => {
    const [cleared, setCleared] = useState(false)
    const [currentValue, setCurrentValue] = useState(value ?? null)
    const [hoverValue, setHoverValue] = useState<number | null>(null)
    const [tooltipValue, setTooltipValue] = useState<number | string | null>(null)
    const _name = name || useId()

    useEffect(() => {
      value !== undefined && setCurrentValue(value)
    }, [value])

    const handleMouseEnter = (value: number) => {
      if (disabled || readOnly) {
        return
      }

      onHover && onHover(value)
      setHoverValue(value)
      value && setTooltipValue(value)
    }

    const handleMouseLeave = () => {
      if (disabled || readOnly) {
        return
      }

      onHover && onHover(null)
      setHoverValue(null)
    }

    const handleOnChange = (value: number) => {
      if (disabled || readOnly) {
        return
      }

      if (cleared) {
        setCleared(false)
        return
      }

      setCurrentValue(value)
      onChange && onChange(value)
    }

    const handleOnClick = (value: number) => {
      if (disabled || readOnly) {
        return
      }

      if (allowClear && value === currentValue) {
        setCleared(true)
        onChange && onChange(null)
        setCurrentValue(null)
        setHoverValue(null)
      }
    }

    return (
      <div
        className={classNames(
          'rating',
          {
            [`rating-${size}`]: size,
            disabled: disabled,
            readonly: readOnly,
          },
          className,
        )}
        role="radiogroup"
        {...rest}
        ref={ref}
      >
        {Array.from({ length: itemCount }, (_, index) => {
          const numberOfRadios = 1 / precision

          return (
            <CConditionalTooltip
              key={index}
              {...(tooltips && {
                content: Array.isArray(tooltips)
                  ? tooltips[index]
                  : precision
                    ? tooltipValue
                    : index + 1,
                tooltip: true,
              })}
            >
              <div className="rating-item">
                {Array.from({ length: numberOfRadios }, (_, _index) => {
                  const isNotLastItem = _index + 1 < numberOfRadios
                  const value =
                    numberOfRadios === 1 ? index + 1 : index + (_index + 1) * (1 * precision)
                  const id = useId()

                  const isItemChecked = () => value === currentValue

                  const isItemActive = () => {
                    if (
                      highlightOnlySelected
                        ? hoverValue === value
                        : hoverValue && hoverValue >= value
                    ) {
                      return true
                    }

                    if (
                      hoverValue === null &&
                      (highlightOnlySelected
                        ? isItemChecked()
                        : currentValue && currentValue >= value)
                    ) {
                      return true
                    }

                    return false
                  }

                  return (
                    <Fragment key={value}>
                      <label
                        className={classNames('rating-item-label', {
                          active: isItemActive(),
                        })}
                        htmlFor={id}
                        onClick={() => handleOnClick(value)}
                        onMouseEnter={() => handleMouseEnter(value)}
                        onMouseLeave={() => handleMouseLeave()}
                        {...(isNotLastItem && {
                          style: {
                            zIndex: 1 / precision - _index,
                            position: 'absolute',
                            width: `${precision * (_index + 1) * 100}%`,
                            overflow: 'hidden',
                            opacity: 0,
                          },
                        })}
                      >
                        {icon ? (
                          <div className="rating-item-custom-icon">
                            {(icon as Icon)[value] ?? icon}
                          </div>
                        ) : (
                          <div className="rating-item-icon"></div>
                        )}
                        {activeIcon && (
                          <div className="rating-item-custom-icon-active">
                            {(activeIcon as Icon)[value] ?? activeIcon}
                          </div>
                        )}
                      </label>
                      <input
                        className="rating-item-input"
                        checked={isItemChecked()}
                        disabled={disabled || readOnly}
                        id={id}
                        name={_name}
                        onBlur={() => handleMouseLeave()}
                        onChange={() => handleOnChange(value)}
                        onFocus={() => handleMouseEnter(value)}
                        type="radio"
                        value={value}
                      />
                    </Fragment>
                  )
                })}
              </div>
            </CConditionalTooltip>
          )
        })}
      </div>
    )
  },
)

CRating.propTypes = {
  children: PropTypes.node,
  activeIcon: PropTypes.any,
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
  highlightOnlySelected: PropTypes.bool,
  icon: PropTypes.any,
  itemCount: PropTypes.number,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onHover: PropTypes.func,
  precision: PropTypes.number,
  readOnly: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'lg', 'custom']),
  value: PropTypes.number,
}

CRating.displayName = 'CRating'

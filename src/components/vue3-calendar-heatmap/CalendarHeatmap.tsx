/**
 * Adapted from https://github.com/razorness/vue3-calendar-heatmap/blob/master/src/components/CalendarHeatmap.vue
 * MIT License
 */
import './CalendarHeatmap.css';
import { defineComponent, nextTick, onBeforeUnmount, onMounted, PropType, ref, toRef, toRefs, watch } from 'vue';
import { CalendarItem, Heatmap, Locale, Month, TooltipFormatter, Value } from './Heatmap';
import tippy, { createSingleton, CreateSingletonInstance, Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/svg-arrow.css';

export default defineComponent({
  name: 'CalendarHeatmap',
  props: {
    endDate: {
      required: true
    },
    max: {
      type: Number
    },
    rangeColor: {
      type: Array as PropType<string[]>
    },
    values: {
      type: Array as PropType<Value[]>,
      required: true
    },
    locale: {
      type: Object as PropType<Partial<Locale>>
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    tooltipUnit: {
      type: String,
      default: Heatmap.DEFAULT_TOOLTIP_UNIT
    },
    tooltipFormatter: {
      type: Function as PropType<TooltipFormatter>
    },
    vertical: {
      type: Boolean,
      default: false
    },
    noDataText: {
      type: [Boolean, String],
      default: null
    },
    round: {
      type: Number,
      default: 0
    },
    /**
     * The heatmap map shows the number of dates between showDateNum and showDateNum + 7.
     */
    showDateNum: {
      type: Number,
      default: 65
    },
    darkMode: Boolean,
    showLable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['dayClick'],
  setup(props, { emit }) {

    const SQUARE_BORDER_SIZE = Heatmap.SQUARE_SIZE / 5,
      SQUARE_SIZE = Heatmap.SQUARE_SIZE + SQUARE_BORDER_SIZE,
      LEFT_SECTION_WIDTH = Math.ceil(Heatmap.SQUARE_SIZE * 2.5),
      RIGHT_SECTION_WIDTH = SQUARE_SIZE * 3,
      TOP_SECTION_HEIGHT = Heatmap.SQUARE_SIZE + (Heatmap.SQUARE_SIZE / 2),
      BOTTOM_SECTION_HEIGHT = Heatmap.SQUARE_SIZE + (Heatmap.SQUARE_SIZE / 2),
      yearWrapperTransform = `translate(${LEFT_SECTION_WIDTH}, ${TOP_SECTION_HEIGHT})`,

      svg = ref<null | SVGElement>(null),
      now = ref(new Date()),
      heatmap = ref(new Heatmap(props.endDate as Date, props.values, props.max, props.showDateNum)),

      width = ref(0),
      height = ref(0),
      viewbox = ref('0 0 0 0'),
      legendViewbox = ref('0 0 0 0'),
      daysLabelWrapperTransform = ref(''),
      monthsLabelWrapperTransform = ref(''),
      legendWrapperTransform = ref(''),
      lo = ref<Locale>({} as any),
      rangeColor = ref<string[]>(props.rangeColor || (props.darkMode ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT));

    const { values, tooltipUnit, tooltipFormatter, noDataText, max, vertical, locale } = toRefs(props);

    let tippyInstances: Instance[],
      tippySingleton: CreateSingletonInstance;

    function initTippy() {
      tippyInstances = tippy(Array.from(svg.value!.querySelectorAll('.vch__day__square[data-tippy-content]')));
      if (tippySingleton) {
        tippySingleton.setInstances(tippyInstances);
      } else {
        tippySingleton = createSingleton(tippyInstances, {
          moveTransition: 'transform 0.1s ease-out',
          allowHTML: true
        });
      }
    }

    function tooltipOptions(day: CalendarItem) {
      if (props.tooltip) {
        if (day.count !== undefined) {
          if (props.tooltipFormatter) {
            return props.tooltipFormatter(day, props.tooltipUnit);
          }
          return `<b>${day.count} ${props.tooltipUnit}</b> ${lo.value.on} ${lo.value.months[day.date.getMonth()]} ${day.date.getDate()}, ${day.date.getFullYear()}`;
        } else if (props.noDataText) {
          return `${props.noDataText}`;
        } else if (props.noDataText !== false) {
          return `<b>No ${props.tooltipUnit}</b> ${lo.value.on} ${lo.value.months[day.date.getMonth()]} ${day.date.getDate()}, ${day.date.getFullYear()}`;
        }
      }
      return undefined;
    }

    function getWeekPosition(index: number) {
      if (props.vertical) {
        return `translate(0, ${(SQUARE_SIZE * heatmap.value.weekCount) - ((index + 1) * SQUARE_SIZE)})`;
      }
      return `translate(${index * SQUARE_SIZE}, 0)`;
    }

    function getDayPosition(index: number) {
      if (props.vertical) {
        return `translate(${index * SQUARE_SIZE}, 0)`;
      }
      return `translate(0, ${index * SQUARE_SIZE})`;
    }

    function getMonthLabelPosition(month: Month) {
      if (props.vertical) {
        return { x: 3, y: (SQUARE_SIZE * heatmap.value.weekCount) - (SQUARE_SIZE * (month.index)) - (SQUARE_SIZE / 4) };
      }
      return { x: SQUARE_SIZE * month.index, y: SQUARE_SIZE - SQUARE_BORDER_SIZE };
    }

    watch([toRef(props, 'rangeColor'), toRef(props, 'darkMode')], ([rc, dm]) => {
      rangeColor.value = rc || (dm ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT);
    });

    watch(vertical, v => {
      if (v) {
        width.value = LEFT_SECTION_WIDTH + (SQUARE_SIZE * Heatmap.DAYS_IN_WEEK) + RIGHT_SECTION_WIDTH;
        height.value = TOP_SECTION_HEIGHT + (SQUARE_SIZE * heatmap.value.weekCount) + SQUARE_BORDER_SIZE;
        daysLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH}, 0)`;
        monthsLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT})`;
      } else {
        width.value = LEFT_SECTION_WIDTH + (SQUARE_SIZE * heatmap.value.weekCount) + SQUARE_BORDER_SIZE;
        height.value = TOP_SECTION_HEIGHT + (SQUARE_SIZE * Heatmap.DAYS_IN_WEEK);
        daysLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT})`;
        monthsLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH}, 0)`;
      }
    }, { immediate: true });

    watch([width, height], ([w, h]) => (viewbox.value = ` 0 0 ${w} ${h}`), { immediate: true });
    watch([width, height, rangeColor], ([w, h, rc]) => {
      legendWrapperTransform.value = vertical.value
        ? `translate(${LEFT_SECTION_WIDTH + (SQUARE_SIZE * Heatmap.DAYS_IN_WEEK)}, ${TOP_SECTION_HEIGHT})`
        : `translate(${w - (SQUARE_SIZE * rc.length) - 30}, ${h - BOTTOM_SECTION_HEIGHT})`;
    }, { immediate: true });

    watch(locale, l => (lo.value = l ? { ...Heatmap.DEFAULT_LOCALE, ...l } : Heatmap.DEFAULT_LOCALE), { immediate: true });
    watch(rangeColor, rc => (legendViewbox.value = `0 0 ${Heatmap.SQUARE_SIZE * (rc.length + 1)} ${Heatmap.SQUARE_SIZE}`), { immediate: true });

    watch(
      [values, tooltipUnit, tooltipFormatter, noDataText, max, rangeColor],
      () => {
        heatmap.value = new Heatmap(props.endDate as Date, props.values, props.max, props.showDateNum);
        tippyInstances?.map(i => i.destroy());
        nextTick(initTippy);
      }
    );

    onMounted(initTippy);
    onBeforeUnmount(() => {
      tippySingleton?.destroy();
      tippyInstances?.map(i => i.destroy());
    });

    const curRangeColor = rangeColor;

    return () => (
      <>
        <div class={{ 'vch__container': true, 'dark-mode': props.darkMode }}>
          <svg class="vch__wrapper" ref={svg} viewBox={viewbox.value}>
            <g class="vch__months__labels__wrapper" transform={monthsLabelWrapperTransform.value}>

              {heatmap.value.firstFullWeekOfMonths.map((month, index) => (
                <text
                  class="vch__month__label"
                  key={index}
                  x={getMonthLabelPosition(month).x}
                  y={getMonthLabelPosition(month).y}
                >
                  {lo.value.months[month.value]}
                </text>
              ))}
            </g>


            <g class="vch__days__labels__wrapper" transform={daysLabelWrapperTransform.value}>
              <text class="vch__day__label"
                x={vertical.value ? SQUARE_SIZE : 0}
                y={vertical.value ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 20}
              >
                {lo.value.days[1]}
              </text>
              <text class="vch__day__label"
                x={vertical.value ? SQUARE_SIZE * 3 : 0}
                y={vertical.value ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 44}
              >
                {lo.value.days[3]}
              </text>
              <text class="vch__day__label"
                x={vertical.value ? SQUARE_SIZE * 5 : 0}
                y={vertical.value ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 69}
              >
                {lo.value.days[5]}
              </text>
            </g >

            {vertical.value &&
              (<g class="vch__legend__wrapper" transform={legendWrapperTransform.value}>
                <text x={SQUARE_SIZE * 1.25} y={8}>{lo.value.less}</text>
                {curRangeColor.value.map((color, index) => (
                  <rect
                    key={index}
                    rx={props.round}
                    ry={props.round}
                    style={{ fill: color }}
                    width={SQUARE_SIZE - SQUARE_BORDER_SIZE}
                    height={SQUARE_SIZE - SQUARE_BORDER_SIZE}
                    x={SQUARE_SIZE * 1.75}
                    y={SQUARE_SIZE * (index + 1)}
                  />
                ))
                }
                <text
                  x={SQUARE_SIZE * 1.25}
                  y={SQUARE_SIZE * (curRangeColor.value.length + 2) - SQUARE_BORDER_SIZE}
                >
                  {lo.value.more}
                </text>
              </g>)}

            <g class="vch__year__wrapper" transform={yearWrapperTransform}>
              {heatmap.value.calendar.map((week, weekIndex) => (
                <g class="vch__week__wrapper"
                  key={weekIndex}
                  transform={getWeekPosition(weekIndex)}
                >
                  {week.map((day, dayIndex) => (
                    (day.date < now.value) &&
                    <rect
                      class="vch__day__square"
                      key={dayIndex}
                      rx={props.round}
                      ry={props.round}
                      transform={getDayPosition(dayIndex)}
                      width={SQUARE_SIZE - SQUARE_BORDER_SIZE}
                      height={SQUARE_SIZE - SQUARE_BORDER_SIZE}
                      style={{ fill: curRangeColor.value[day.colorIndex] }}
                      data-tippy-content={tooltipOptions(day)}
                      onClick={() => emit('dayClick', day)}
                    />
                  ))}
                </g>))}
            </g>
          </svg >

          {props.showLable &&
            <div class="vch__legend">
              <slot name="legend">
                <div class="vch__legend-left">
                  <slot name="vch__legend-left"></slot>
                </div>
                <div class="vch__legend-right">
                  <slot name="legend-right">
                    <div class="vch__legend">
                      <div>{lo.value.less}</div>
                      {!vertical.value && <svg class="vch__external-legend-wrapper" viewBox={legendViewbox.value} height={SQUARE_SIZE - SQUARE_BORDER_SIZE}>
                        <g class="vch__legend__wrapper">
                          {curRangeColor.value.map((color, index) => (
                            <rect
                              key={index}
                              rx={props.round}
                              ry={props.round}
                              style={{ fill: color }}
                              width={SQUARE_SIZE - SQUARE_BORDER_SIZE}
                              height={SQUARE_SIZE - SQUARE_BORDER_SIZE}
                              x={SQUARE_SIZE * index}
                              y={0}
                            />
                          ))}
                        </g>
                      </svg>}
                      <div>{lo.value.more}</div>
                    </div>
                  </slot>
                </div>
              </slot>
            </div>
          }
        </div >

      </>
    )
  }
});

import { defineComponent, reactive, ref } from 'vue';
import './App.css'
import Home from './page/home';
import { CalendarHeatmap } from 'vue3-calendar-heatmap';

export default defineComponent({
  props: {
  },

  setup(props) {
    const values = reactive([
      {
        'date': '2022-06-13T00:00:00Z',
        'count': 635000
      },
      {
        'date': '2022-06-14T00:00:00Z',
        'count': 2442000
      },
    ]);
    const orientation = ref("horizontal");
    return () => (
      <>
        <Home />
        <CalendarHeatmap
          values={values}
          endDate={new Date()}
          style={{ 'max-width:': (orientation.value == 'vertical' ? '145px' : '675px') }}
          vertical={orientation.value === 'vertical'}
          noDataText="NOTHING"
          round={2}
        ></CalendarHeatmap>
      </>
    )
  }
})
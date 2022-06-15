import { defineComponent, reactive, ref } from 'vue';
import './App.css'
import Home from './pages/home';
import { CalendarHeatmap } from './components/vue3-calendar-heatmap';

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
          range-color={['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']}
          style={{ 'max-width:': (orientation.value == 'vertical' ? '145px' : '675px') }}
          vertical={orientation.value === 'vertical'}
          noDataText="NOTHING"
          round={2}
        ></CalendarHeatmap>
      </>
    )
  }
})
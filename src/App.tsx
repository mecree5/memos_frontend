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
        <div style="width:200px">
          <CalendarHeatmap
            values={values}
            endDate={new Date()}
            showDateNum={80}
            rangeColor={['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']}
            vertical={orientation.value === 'vertical'}
            noDataText="NOTHING"
            round={2}
          ></CalendarHeatmap>
        </div>
      </>
    )
  }
})
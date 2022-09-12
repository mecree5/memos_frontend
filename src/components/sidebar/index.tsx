import { defineComponent, reactive, ref } from "vue";
import { CalendarHeatmap } from "/@/components/vue3-calendar-heatmap";
import UserInfo from '/@/components/userinfo';
import "./index.css"

export default defineComponent({
  name: "sidebar",
  setup() {
    const values = reactive([
      {
        'date': '2022-08-13T00:00:00Z',
        'count': 635000
      },
      {
        'date': '2022-09-10T00:00:00Z',
        'count': 2442000
      },
    ]);
    const orientation = ref("horizontal");
    const toggleSiderbar = () => {
      console.log('toggleSiderbar')
      const sidebarEl = document.body.querySelector(".sidebar-wrapper") as HTMLDivElement;
      const display = window.getComputedStyle(sidebarEl).display;
      if (display === "none") {
        sidebarEl.style.display = "flex";
      } else {
        sidebarEl.style.display = "none";
      }
    }

    return () => (
      <>
        <aside class="sidebar-wrapper">
          <UserInfo />
          <CalendarHeatmap
            values={values}
            endDate={new Date()}
            showDateNum={75}
            rangeColor={['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']}
            vertical={orientation.value === 'vertical'}
            noDataText="NOTHING"
            round={2}
          ></CalendarHeatmap>
        </aside>
      </>
    )
  }
})
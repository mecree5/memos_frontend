import { defineComponent, onMounted, ref } from "vue";
import Sidebar from "/@/components/sidebar";
import "./index.css";
import MemosView from "/@/components/memos-view";


export default defineComponent({
  name: "Home",
  setup() {


    return () => (
      <>
        <div class="container mx-auto relative w-full min-h-screen flex flex-row justify-start sm:justify-center items-start;">
          <Sidebar />
          <MemosView />
        </div>
      </>
    );
  }
})
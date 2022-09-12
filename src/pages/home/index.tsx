import { defineComponent, onMounted, ref } from "vue";
import MDEditor, { MODE } from '/@/components/md-editor';
import Sidebar from "/@/components/sidebar";
import "./index.css";


export default defineComponent({
  name: "Home",
  setup() {
    const text = ref('');
    let mode = ref(MODE.EDIT);

    return () => (
      <>
        <div class="container mx-auto relative w-full min-h-screen flex flex-row justify-start sm:justify-center items-start;">
          <Sidebar />
          <main class="memos-wrapper">
            <MDEditor
              v-model={text.value}
              v-model:mode={mode}
            ></MDEditor>
          </main>
        </div>
      </>
    );
  }
})
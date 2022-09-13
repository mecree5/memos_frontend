import { defineComponent, reactive, ref } from "vue";
import MDEditor, { MODE } from '/@/components/md-editor';
import "./index.css";
import { relative } from "node:path/win32";

export default defineComponent({
  name: "MemosView",
  setup() {
    const text = ref('');
    let mode = ref(MODE.EDIT);
    let modes = reactive(new Array(3).fill(0).map(e=>MODE.PREVIEW))
    return () => (
      <>
        <main class="memos-wrapper">
          <div class="mb-1 w-full">
            <MDEditor
              class="pb-1"
              v-model={text.value}
              v-model:mode={mode}
            ></MDEditor>
          </div>
          <div class="mb-1 w-full">
            <MDEditor
              class="pb-1"
              v-model={text.value}
              v-model:mode={modes[0]}
            ></MDEditor>
          </div>
          <div class="mb-1 w-full">
            <MDEditor
              class="pb-1"
              v-model={text.value}
              v-model:mode={modes[1]}
            ></MDEditor>
          </div>
          <div class="mb-1 w-full">
            <MDEditor
              class="pb-1"
              v-model={text.value}
              v-model:mode={modes[2]}
            ></MDEditor>
          </div>

        </main>
      </>
    );
  }
})
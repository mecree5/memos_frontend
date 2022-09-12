import { defineComponent, onMounted, PropType, ref } from "vue"
import "./index.css"

export enum MODE {
  EDIT = "edit",
  EDITABLE = "editable",
  PREVIEW = "preview"
}

export default defineComponent({
  name: "MDEditor",
  props: {
    modelValue: {
      type: String,
      require: true,
    },
    height: {
      type: Number,
      default: 260,
    },
    leftToolbar: {
      type: String,
      default: "table | save"
    },
    rightToolbar: {
      type: String,
      default: "preview toc sync-scroll fullscreen"
    },
    mode: {
      type: String as PropType<MODE>,
      default: MODE.EDIT,
    }
  },
  emits: ['update:modelValue', 'input', 'update:mode'],
  setup(props, { emit }) {
    function onInput(value: string) {
      emit('update:modelValue', value)
    }

    function onDoubleClick(){
      console.log('onDoubleClick');
      emit('update:mode', MODE.EDIT)
    }

    return () => (
      <>
        <div class="border-4 border-gray-100 w-full h-fit rounded-2xl z-10 overflow-hidden" onDblclick={onDoubleClick}>
        <v-md-editor
          placeholder="Any thounghts..."
          modelValue={props.modelValue}
          onUpdate:modelValue={onInput}
          height={props.height + "px"}
          include-level={[1, 2, 3]}
          left-toolbar={props.leftToolbar}
          right-toolbar={props.rightToolbar}
          tab-size={2}
          mode={props.mode}
          ></v-md-editor>
      </div>
      </>
    )
  }
})
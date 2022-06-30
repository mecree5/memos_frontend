import { defineComponent } from 'vue';
import "./index.css";

export default defineComponent({
  name: "Avatar",
  props: {
    url: {
      type: String,
      default: "/@/assets/avatar.jpeg"
    }
  },
  setup(props) {
    return () => (
      <>
        <div class="w-24 h-24 rounded-full border-2 overflow-hidden">
            <img class="" src={props.url}></img>
        </div>
      </>
    )
  }
})
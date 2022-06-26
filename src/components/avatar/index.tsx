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
        <div class="avatar-border">
          <div class="avatar-container">
            <img src={props.url}></img>
          </div>
        </div>
      </>
    )
  }
})
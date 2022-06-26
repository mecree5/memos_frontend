import { defineComponent } from "vue";
import Avatar from "../avatar";
import "./index.css"

export default defineComponent({
  name: "UserInfo",
  props: {
    userInfo: Object
  },
  setup(props) {
    return () => (
      <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{padding: "3px"}}>
            <Avatar />
          </div>
          <div class="flex-layout-column" style={{ width: "100%" }}>
            <div class="flex-layout" style={{ width: "100%", paddingTop: "8px" }}>
              <span class="info-text-25" style={{ color: "#5F5F5F" }}>Maiiiiiid</span>
              <i></i>
            </div>
            <div class="flex-layout" style={{ width: "100%", paddingBottom: "8px" }}>
              <div class="flex-layout-column">
                <span class="info-text-25">304</span>
                <span class="info-text-15">Memos</span>
              </div>
              <div class="flex-layout-column">
                <span class="info-text-25">34</span>
                <span class="info-text-15">Tags</span>
              </div>
              <div class="flex-layout-column">
                <span class="info-text-25">304</span>
                <span class="info-text-15">Days</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
})
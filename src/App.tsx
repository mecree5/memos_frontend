import { defineComponent } from 'vue';
import './App.css'
import Home from './pages/home';

export default defineComponent({
  props: {
  },
  setup(props) {

    return () => <Home/>
  }
})
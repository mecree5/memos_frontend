import { createApp } from 'vue'
import App from './App'

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// highlightjs
import hljs from 'highlight.js';
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';


import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import '@kangc/v-md-editor/lib/theme/style/github.css';

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
VMdEditor.use(createAlignPlugin());

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

const app = createApp(App);
app.use(VMdEditor);
app.use(VMdPreview); 

app.mount('#app')
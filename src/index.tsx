import { createApp, Fragment } from 'rumious';
import {Navbar} from './components/Navbar';
import {Offcanvas} from './components/Offcanvas'
import initRouter from "./router";
import './main.lightizui.style';



let rootElement = document.getElementById('root');
if(!rootElement) {
  throw 'Root element not found '
}



const app = createApp({
  root:rootElement
});

const router = initRouter(app);

app.render(
  <Fragment>
    <Navbar/>
    <Offcanvas/>
    <div class="container" style="margin-top:5rem">
      {router.rootInject}
    </div>
  </Fragment>
);

router.start();
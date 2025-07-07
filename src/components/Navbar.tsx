import { RumiousComponent, Fragment} from 'rumious';
import {UIControlContext} from '../context';


export class Navbar extends RumiousComponent < null > {
  template(){
    return (
      <Fragment>
        <nav class="navbar" style="z-index:9999;">
          <div class="navbar-header">
            <button on:click={()=> UIControlContext.emit("menu:open")} class="offcanvas-toggle btn-icon btn-rounded material-icons">menu</button>
            <h3 class="navbar-title">Safety</h3>
          </div>
        </nav>
      </Fragment>
    );
  }
}
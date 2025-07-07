import { RumiousComponent, Fragment } from 'rumious';
import { LightizUIOffcanvas } from 'lightiz-ui';
import { UIControlContext } from '../context';

const MENU_ITEMS = [
  {
    icon: 'home',
    title: 'Home'
  },
  {
    icon: 'block',
    title: 'Blocked Pages'
  },
  {
    icon: 'block',
    title: 'Whitelist'
  },
];

export class Offcanvas extends RumiousComponent < null > {
  onRender() {
    let offcanvas = new LightizUIOffcanvas(
      document.getElementById("menu")
    );
    
    UIControlContext.on("menu:open", () => offcanvas.open());
  }
  
  template() {
    return (
      <Fragment>
        <div class="offcanvas" style="z-index:9999;" id="menu">
          <div class="offcanvas-header">
            <h3 class="offcanvas-title">Safety</h3>
            <button class="offcanvas-toggle btn-icon btn-rounded material-icons">close</button>
          </div>
          <div class="offcanvas-body">
            <ul class="offcanvas-menu">
              {MENU_ITEMS.map((item)=>{
                return (
                  <li>
                    <a class="d-flex align-center" style="column-gap: 8px; align-items: center;">
                      <i class="material-icons" style="font-size: 20px;">{item.icon}</i>
                      <span style="font-size: 16px; line-height: 1;">{item.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Fragment>
    );
  }
}
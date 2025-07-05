import { RumiousComponent, Fragment,createStore,createContext } from 'rumious';
import {Table} from '../components/Table';
import {AppContext} from '../context';
import {fieldLabelMap} from '../data';

export class Page extends RumiousComponent < null > {
  
  private tableControl = createContext({});
  onCreate(){
    AppContext.set(
      "scanResult",
      {
        "id":"29202992-292029292-292929912"
      }
    );
  }
  
  
  template() {
    return (
      <Fragment>
        <h2 class="heading-1">Analysis results </h2>
        <br/>
        <div class="form-group">
          <input type="text" class="form-input" placeholder="URL..."/>
        </div>
        <br/>
        <section class="p-3" bind:show={AppContext.reactive("scanResult")}>
          <h3>Page Summary</h3>
          <Table
            labelsMap={fieldLabelMap}
            controlCtx={this.tableControl}
            data={AppContext.reactive("scanResult")}
          />
        </section>        
      </Fragment>
    );
  }
}
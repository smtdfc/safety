import { RumiousComponent, Fragment, createStore, createContext } from 'rumious';
import { Table } from '../components/Table';
import { ScanResultDisplay } from '../components/ScanResultDisplay';
import { AppContext } from '../context';
import { fieldLabelMap } from '../data';
import { ScanService } from '../services/scanner';
import { getCurrentURL, getCurrentPageInfo } from '../helpers';
import { PageInfo } from '../types';


export class Page extends RumiousComponent < null > {
  
  private currentUrl = "";
  private pageInfo!: PageInfo;
  private tableControl = createContext({});
  async beforeRender() {
    this.pageInfo = await getCurrentPageInfo()
    this.currentUrl = await getCurrentURL();
  }
  
  async scan() {
    ScanService.scan(this.pageInfo);
  }
  
  template() {
    return (
      <Fragment>
        <h2 class="heading-1">Website Analysis Results 🔍</h2>
        <p class="sub-text mt-2">
          Use this tool to analyze any webpage for common scam, phishing, or suspicious patterns.
          Click <b>Scan</b> to begin scan this page. This tool runs all detection rules and shows which ones are triggered.
        </p>
        <br/>
        <div class="form-group">
          <input type="text" class="form-input" placeholder="URL..." value={this.currentUrl}/>
        </div>
        <div class="d-flex align-center justify-center" style="flex-wrap:wrap">
          <button on:click={() => this.scan()} class="btn btn-rounded btn-sm btn-primary btn-icon-text" >
            <i class="icon material-icons">search</i> Scan
          </button>
          <button class="btn btn-rounded btn-sm btn-danger btn-icon-text">
            <i class="icon material-icons">block</i> Block
          </button>
          <button class="btn btn-rounded btn-sm btn-danger btn-icon-text">
            <i class="icon material-icons">call_missed</i> Ignore
          </button>
        </div>
        <br/>
        <section class="p-3" bind:hide={AppContext.reactive("scanResult")}>
          <h3 class="text-center">Click "scan" to start</h3>
          <p class="sub-text mt-2 text-center">The system will detect phishing markers, insecure content, or scam indicators.</p>
        </section>
        <section class="p-3" bind:show={AppContext.reactive("scanResult")}>
          <h3>Page Summary</h3>
          <p class="sub-text mt-2">Below is a breakdown of the page metadata and scan result. Pay close attention to any failed rules.</p>
          <Table
            labelsMap={fieldLabelMap}
            controlCtx={this.tableControl}
            data={AppContext.reactive("scanResult")}
          />
          <br/>
      
          <ScanResultDisplay 
            title="❌ Rules Not Passed"
            scanRuleType="issued"
            controlCtx={this.tableControl}
            data={AppContext.reactive("scanResult")}
          />
          <br/>
      
          <ScanResultDisplay 
            title="✅ Rules Passed"
            scanRuleType="passed"
            controlCtx={this.tableControl}
            data={AppContext.reactive("scanResult")}
          />
          <br/>
      
          <ScanResultDisplay 
            title="⚠️ Rules Skipped"
            scanRuleType="skipped"
            controlCtx={this.tableControl}
            data={AppContext.reactive("scanResult")}
          />
        </section>
      </Fragment>
    );
  }
}
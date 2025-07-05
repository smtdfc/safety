import {
  RumiousContext,
  RumiousComponent,
  Fragment,
  RumiousState,
  createRef,
  watch
} from 'rumious';

import { ScanResult } from '../types';

export interface ScanResultDisplayProps {
  title: string;
  scanRuleType: "issued" | "passed" | "skipped";
  data: RumiousState < ScanResult | null > ;
  controlCtx ? : RumiousContext < {} > ;
}

export class ScanResultDisplay extends RumiousComponent < ScanResultDisplayProps > {
  private tableRef = createRef();
  
  onRender() {
    watch(this.props.data, () => {
      this.renderTo(this.tableRef, this.renderItem(true))
    });
  }
  
  renderItem(clear = false) {
    if (clear) this.tableRef.text = "";
    let dataType = this.props.scanRuleType;
    let data:any = this.props.data.get();
    if (!data) return <Fragment></Fragment>;
    if (dataType === "issued") data = data.issues;
    else if (dataType === "passed") data = data.passedRules;
    else if (dataType === "skipped") data = data.skippedRules;
    else data = [];
    return (
      <Fragment>
        <thead>
          <tr>
            <th>Rule ID</th>
            <th>Describe </th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v:any) => (
            <tr>
              <td>{v.ruleId}</td>
              <td>{v.description}</td>
              <td>{dataType.toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </Fragment>
    );
  }
  
  template() {
    return (
      <Fragment>
        <h3>{this.props.title}</h3>
        <div class="mt-3 table-container">
          <table ref={this.tableRef} class="table">
            {this.renderItem()}
          </table>
        </div>
      </Fragment>
    );
  }
}
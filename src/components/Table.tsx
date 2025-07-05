import {
  RumiousContext, RumiousComponent, Fragment,
  RumiousState, createRef, watch
} from 'rumious';

export interface TableProps {
  labelsMap?: Record<string, string>;
  data: RumiousState<object | null>;
  controlCtx?: RumiousContext<{}>;
}

export class Table extends RumiousComponent<TableProps> {
  private tableRef = createRef();

  onRender() {
    watch(this.props.data, () =>
      this.renderTo(this.tableRef, this.renderItem(true))
    );
  }

  renderItem(clear = false) {
    if (clear) this.tableRef.text = "";
    const data = this.props.data;
    if (!data) return "";

    const labels = this.props.labelsMap ?? {};
    return (
      <tbody>
        {data.map((v, k) => (
          <tr>
            <td>{labels[k] ?? k}</td>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    );
  }

  template() {
    return (
      <Fragment>
        <div class="mt-3 table-container">
          <table ref={this.tableRef} class="table">
            {this.renderItem()}
          </table>
        </div>
      </Fragment>
    );
  }
}
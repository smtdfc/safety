import { RumiousComponent, Fragment} from 'rumious';

export class Navbar extends RumiousComponent < null > {
  template(){
    return (
      <Fragment>
        <nav class="navbar">
          <div class="navbar-header">
            <button class="navbar-toggle btn-icon btn-rounded material-icons">menu</button>
            <h3 class="navbar-title">Safety</h3>
          </div>
        </nav>
      </Fragment>
    );
  }
}
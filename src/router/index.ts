import { RumiousApp } from 'rumious';
import { RumiousRouterModule, } from 'rumious-router';


export default function(app: RumiousApp):any {
  const router = app.addModule(RumiousRouterModule, {
    strategy: 'hash'
  });
  
  router.addRoute('/', (async () => (await import("../pages")).Page), []);

  router.event.on('not_found',function({router}){
    console.log("404");
  });
  
  return router;
}
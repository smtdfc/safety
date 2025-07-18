import {RumiousStore,createStore,createContext} from 'rumious';
import {ScanResult} from '../types';

export interface ContextData{
  scanResult:ScanResult| null;
}

export const UIControlContext = createContext({});
export const AppContext = createContext<ContextData>({
  scanResult:null
});
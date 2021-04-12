import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

/*
  - the purpose of this hook is that the clients
    doesn't have to configure the dispatch over
    and over again every time they need dispatch
    an action as the dispatch has been pre-configured
    here
  - instead the clients can just call the individual 
    action generator destructured from the return 
    value of this hook:
    const { updateCell } = useActions();   
*/

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(actionCreators, dispatch);
};

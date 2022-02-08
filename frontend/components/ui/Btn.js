import { Router } from 'next/router';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';
import { setCurrPlotLink } from '../../slices/plotDataSlice';
;



const Btn = (props) => {

    console.log("Inside BTN: ", props.link)

    const router = useRouter()
    const dispatch = useDispatch()

    const onHistoryPlotHandler = (e)=>{
        e.preventDefault()
        // console.log("Clicked")
        dispatch(setCurrPlotLink(props.link))
        router.push('/plot')

    }

  return <div>
      {props.status=="PROCESSED" &&
      <button disabled={!props.status=="PROCESSED"} type="button" className="btn btn-outline-info" onClick={onHistoryPlotHandler}>Plot</button>
      }
  </div>;
};

export default Btn;

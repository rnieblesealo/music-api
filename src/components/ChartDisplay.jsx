import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";

const ChartDisplay = ({ chart, name, desc, showState, showFunc }) => {
  return (
    <div className="flex flex-col items-start text-left min-w-[500px]">
      <div className="flex items-center justify-center">
        <button
          className="bg-gray-900 p-3 text-2xl rounded-2xl mr-4"
          onClick={() => {
            showFunc(!showState)
          }}
        >
          {showState ? <LuEye /> : <LuEyeClosed />}
        </button>
        <div>
          <h2 className="text-lg font-bold">{name}</h2>
          <p className="text-gray-500">{desc}</p>
        </div>
      </div>
      {showState && chart}
    </div>
  )
}

export default ChartDisplay;

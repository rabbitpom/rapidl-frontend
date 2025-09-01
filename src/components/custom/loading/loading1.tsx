import "./loading1.css";

function LoadingBarsMirrored() {
  return (
    <>
      <div className="pl4 m-0">
        <div className="pl4__a"></div>
        <div className="pl4__b"></div>
        <div className="pl4__c"></div>
        <div className="pl4__d"></div>
      </div>
      <div className="pl4 transform rotate-180 m-0">
        <div className="pl4__a"></div>
        <div className="pl4__b"></div>
        <div className="pl4__c"></div>
        <div className="pl4__d"></div>
      </div>
    </>
  );
}

export default LoadingBarsMirrored;

import React from "react";

const AddChannelCard = ({ newChannel, setNewChannel, headersText, setHeadersText, onTypeChange, saveNew }) => {
  return (
    <div className="box">
      <div className="box-header">
        <div className="box-title">Add Integration Channel</div>
      </div>
      <div className="box-body">
        <div className="grid grid-cols-12 gap-3">
          <div className="xl:col-span-6 col-span-12">
            <input className="form-control" placeholder="Name" value={newChannel.name} onChange={e=>setNewChannel({...newChannel, name:e.target.value})} />
          </div>
          <div className="xl:col-span-3 col-span-12">
            <select className="form-select" value={newChannel.type} onChange={e=>onTypeChange(e.target.value)}>
              <option value="api">api</option>
              <option value="excel">excel</option>
            </select>
          </div>
          <div className="xl:col-span-3 col-span-12">
            <select className="form-select" value={newChannel.auth_type} onChange={e=>setNewChannel({...newChannel, auth_type:e.target.value})}>
              <option value="none">none</option>
              <option value="bearer">bearer</option>
              <option value="hmac">hmac</option>
            </select>
          </div>

          <div className={`xl:col-span-6 col-span-12 ${newChannel.type==="api" ? "" : "hidden"}`}>
            <input className="form-control" placeholder="Base URL" value={newChannel.base_url} onChange={e=>setNewChannel({...newChannel, base_url:e.target.value})} />
          </div>
          <div className={`xl:col-span-6 col-span-12 ${newChannel.type==="api" ? "" : "hidden"}`}>
            <input className="form-control" placeholder="Ingest Path" value={newChannel.ingest_path} onChange={e=>setNewChannel({...newChannel, ingest_path:e.target.value})} />
          </div>

          <div className={`xl:col-span-6 col-span-12 ${newChannel.type==="api" && newChannel.auth_type==="bearer" ? "" : "hidden"}`}>
            <input className="form-control" placeholder="Bearer Token" value={newChannel.bearer_token} onChange={e=>setNewChannel({...newChannel, bearer_token:e.target.value})} />
          </div>
          <div className={`xl:col-span-6 col-span-12 ${newChannel.type==="api" && newChannel.auth_type==="hmac" ? "" : "hidden"}`}>
            <input className="form-control" placeholder="HMAC Secret" value={newChannel.secret} onChange={e=>setNewChannel({...newChannel, secret:e.target.value})} />
          </div>

          <div className="xl:col-span-12 col-span-12">
            <textarea className="form-control" rows={4} placeholder="Headers JSON" value={headersText} onChange={e=>setHeadersText(e.target.value)} />
          </div>

          <div className="xl:col-span-6 col-span-12">
            <div className="custom-toggle-switch">
              <input id="ch-active" type="checkbox" checked={!!newChannel.active} onChange={(e)=>setNewChannel({...newChannel, active:e.target.checked})} />
              <label htmlFor="ch-active" className="label-primary"></label>
            </div>
          </div>

          <div className="xl:col-span-6 col-span-12 flex justify-end gap-2">
            <button onClick={saveNew} className="ti-btn ti-btn-primary">
              <i className="ri-save-3-line" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChannelCard;

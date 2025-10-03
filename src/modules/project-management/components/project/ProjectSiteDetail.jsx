import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const ProjectSiteDetail = ({ site }) => {
    if (!site) return null;

    return (
        <div className="box">
            {/* Header */}
            <div className="box-header justify-between">
                <div className="box-title">Site Information</div>
            </div>

            {/* Body */}
            <div className="box-body !p-0">
                <div className="table-responsive">
                    <table className="table whitespace-nowrap min-w-full">
                        <tbody>
                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Name :</span></td>
                            <td>{site.name}</td>
                        </tr>
                        {site.latitude && site.longitude && (
                            <tr>
                                <td colSpan="2">
                                    <div className="h-56 w-full rounded-lg overflow-hidden border border-gray-200">
                                        <MapContainer
                                            center={[site.latitude, site.longitude]}
                                            zoom={15}
                                            style={{ height: "100%", width: "100%" }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                            />
                                            <Marker position={[site.latitude, site.longitude]}>
                                                <Popup>
                                                    <strong>{site.name}</strong>
                                                    <br />
                                                    {site.address}
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectSiteDetail;

import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {MapPin} from "lucide-react";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const BoqSiteCard = ({site = null}) => {
    return (
        site && (
            <div className="box">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 box-header justify-between dark:text-gray-200 dark:bg-bodybg">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-600"/>
                        <h6>Site Information</h6>
                    </div>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <div className="font-medium text-sm text-gray-900">{site.name}</div>
                            <div className="text-xs text-gray-500">{site.address}</div>
                        </div>

                        {site.latitude && site.longitude && (
                            <div className="h-56 w-full rounded-lg overflow-hidden border border-gray-200">
                                <MapContainer
                                    center={[site.latitude, site.longitude]}
                                    zoom={15}
                                    style={{height: "100%", width: "100%"}}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={[site.latitude, site.longitude]}>
                                        <Popup>
                                            <strong>{site.name}</strong>
                                            <br/>
                                            {site.address}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        )}
                    </div>
                </div>
                )
                )

                }
                export default BoqSiteCard;
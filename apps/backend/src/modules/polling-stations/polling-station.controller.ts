import { Request, Response } from "express";


import {

createPollingStation,
getPollingStations,
getPollingStationById,
updatePollingStation,
deletePollingStation

} from "./polling-station.service";




export async function create(
req:Request,
res:Response
){

try{


const data = await createPollingStation(req.body);


return res.status(201).json({

success:true,

data

});


}catch(error:any){


return res.status(500).json({

success:false,

message:error.message

});


}

}




export async function index(
req:Request,
res:Response
){

try{


const data = await getPollingStations();


return res.json({

success:true,

data

});


}catch(error:any){

return res.status(500).json({

success:false,

message:error.message

});

}

}





export async function show(
req:Request,
res:Response
){

try{


const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id ?? "");
const data = await getPollingStationById(id);


return res.json({

success:true,

data

});


}catch(error:any){

return res.status(500).json({

success:false,

message:error.message

});

}

}





export async function update(
req:Request,
res:Response
){

try{


const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id ?? "");
const data = await updatePollingStation(id, req.body);



return res.json({

success:true,

data

});


}catch(error:any){

return res.status(500).json({

success:false,

message:error.message

});

}

}




export async function remove(
req:Request,
res:Response
){

try{


const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id ?? "");
await deletePollingStation(id);



return res.json({

success:true,

message:"Polling station deleted"

});


}catch(error:any){

return res.status(500).json({

success:false,

message:error.message

});

}

}
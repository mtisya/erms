import { Router } from "express";


import {

create,
index,
show,
update,
remove

} from "./polling-station.controller";


import {

createPollingStationValidation,
updatePollingStationValidation

} from "./polling-station.validation";


import { validationResult } from "express-validator";



const router = Router();



const validate = (
req:any,
res:any,
next:any
)=>{

const errors = validationResult(req);


if(!errors.isEmpty()){

return res.status(422).json({

success:false,

errors:errors.array()

});

}


next();

};





router.post(
"/",
createPollingStationValidation,
validate,
create
);



router.get(
"/",
index
);



router.get(
"/:id",
show
);



router.put(
"/:id",
updatePollingStationValidation,
validate,
update
);



router.delete(
"/:id",
remove
);



export default router;
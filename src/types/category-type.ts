import { ReactNode } from "react"

export type CategoryDataType = {
    categories : {
        _data : []
    }
}
export type CategoryProps ={
    deleteCategory : Function
    categories : {
        data : {id:number,name:string}[],
        totalRecords : number,
    }
}
export type ModalType ={
    isClose? : boolean
    isOpen:boolean,
    open:Function,
    title:string,
    body:string,
    children:ReactNode
    classBody? : string
}
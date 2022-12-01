import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
//import { teachersList } from './data.js'
import axios from 'axios'

import FirebaseContext from '../../utils/FirebaseContext'
import TeacherService from '../../services/TeacherService'

const ListTeacherPage = () => {
    return (
        <FirebaseContext.Consumer>
            {value => <ListTeacher firebase={value} />}
        </FirebaseContext.Consumer>
    )
}

const ListTeacher = (props) => {

    const [teachers, setTeachers] = useState([])
    const [reload, setReload] = useState(false)

    useEffect(
        () => {
            TeacherService.list_on_snapshot(
                props.firebase.getFirestoreDb(),
                (teachers) => {
                    //console.log(teachers)
                    setTeachers(teachers)
                }
            )
            //console.log(props.firebase.getFirestoreDb())
        }
        ,
        []
    )

    function deleteTeacherV2(id) {
        if (window.confirm('Deseja excluir?')) {
            TeacherService.delete(
                props.firebase.getFirestoreDb(),
                ()=>{
                   let teachersTemp = teachers
                   for(let i=0;i<teachersTemp.length;i++){
                        if(teachersTemp[i].id===id){
                            teachersTemp.splice(i,1)
                            break
                        }
                   }
                   setTeachers(teachersTemp)
                   setReload(!reload)
                },
                id
            )//delete
        }
    }

    function deleteTeacher(id) {
        if (window.confirm('Deseja excluir?')) {
            TeacherService.delete(
                props.firebase.getFirestoreDb(),
                ()=>{
                    let teachersResult = teachers.filter(
                        (teacher)=>teacher.id !== id
                    )
                    setTeachers(teachersResult)
                },
                id
            )//delete
        }//if
    }//function

    const generateTableBody = () => {
        /*return (
            <div>
                {JSON.stringify(teachersList)}
            </div>
        )*/
        return teachers.map(
            (element, index) => {
                element.key = index
                return (
                    <tr>
                        <td>{element.id}</td>
                        <td>{element.name}</td>
                        <td>{element.course}</td>
                        <td>{element.salary}</td>
                        <td>
                            <Link to={'/editTeacher/' + element.id} className='btn btn-primary'>
                                Editar
                            </Link>
                        </td>
                        <td>
                            <button className='btn btn-danger' onClick={() => deleteTeacherV2(element.id)}>
                                Apagar
                            </button>
                        </td>
                    </tr>
                )
            }
        )
    }

    return (
        <div>
            <h1>Listar Professor</h1>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Curso</th>
                        <th>Salario</th>
                        <th colSpan={2}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {generateTableBody()}
                </tbody>
            </table>
        </div>
    )
}

export default ListTeacherPage
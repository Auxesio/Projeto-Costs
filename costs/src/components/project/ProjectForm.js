import { useState, useEffect } from 'react'
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'

import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import styles from '../pages/NewProject.module.css'



function ProjectForm({ maoSubmit,projectData }) {
  const [project, setProject] = useState(projectData || {})
  const [categories, setCategories] = useState([])

  const validationPost = yup.object().shape({
    name: yup.string()
        .required('Inclua o nome do projeto!')
        .max(40, 'O título precisa ser menor que 40 caracteres'),
    budget: yup.number()
        .typeError('Custo precisa ser preenchido')
        .required('Por favor informe o custo')
  }).required()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationPost)
  })

  useEffect(() => {
    fetch('http://localhost:5000/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setCategories(data)
      })
  }, [])

  const submit = () => {
    
    maoSubmit(project)
  }

  function handleChange(e) {
    setProject({ ...project, [e.target.name]: e.target.value })
  }

  function handleCategory(e) {
    setProject({
      ...project,
      category: {
        id: e.target.value,
        name: e.target.options[e.target.selectedIndex].text,
      },
    })
  }

  

  return (
    <div >
            <form onSubmit={handleSubmit(submit)} className={styles.form}>

                <div className={styles.form_control}>
                    <label>Titulo</label>
                    <input
                        type="text"
                        name='name'
                        placeholder='Insira o nome do projeto'
                        {...register('name')}
                        onChange={handleChange}
                        value={project.name}
                    />
                    <p>{errors.name?.message}</p>
                </div>

                <div className={styles.form_control}>
                    <label>Custo</label>
                    <input
                        type="number"
                        name='budget'
                        placeholder='Insira o orçamento total'
                        {...register('budget')}
                        onChange={handleChange}
                        value={project.budget}
                    />
                    <p>{errors.budget?.message}</p>
                </div>

                <div className={styles.form_control}>
                    <Select
                        name='category_id'
                        text='Selecione a categoria'
                        options={categories}
                        {...register('category_id')}
                        handleOnChange={handleCategory}
                        value={project.category ? project.category.id : ''}
                    />
                    <p>{errors.category_id?.message}</p>
                </div>

                <div className={styles.botao}>
                    <button
                        className={styles.btn} type='submit'>
                        Enviar
                    </button>
                </div>
            </form>
        </div>
  )
}

export default ProjectForm
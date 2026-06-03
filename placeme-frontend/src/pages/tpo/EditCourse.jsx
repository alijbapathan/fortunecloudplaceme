const { id } = useParams()

useEffect(() => {
  loadCourse()
}, [])

const loadCourse = async () => {
  const res = await tpoApi.getCourse(id)
  setFormData(res.data)
}

const handleSubmit = async () => {
  await tpoApi.updateCourse(id, formData)
}
const Form = ({ children, handleSubmit }) => {
  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

export default Form

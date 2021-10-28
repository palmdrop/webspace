
type Props = {
  width? : string,
  height? : string
}

const Overflow = ( { width = '0', height = '0' } : Props ) : JSX.Element => {
  return (
    <div
      className="overflow"
      style={{
        width: width,
        height: height
      }}
    />
  )
}

export default Overflow;
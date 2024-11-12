const NodeSkeletons = () => {
  return (
    <>
      <div className="skeleton h-32 w-full my-4" />
      {[...Array(6)].map((_, index) => (
        <div key={index} className="skeleton h-16 w-full my-4"></div>
      ))}
    </>
  );
};

export default NodeSkeletons;

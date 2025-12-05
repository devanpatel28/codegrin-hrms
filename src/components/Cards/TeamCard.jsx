export default function TeamCard(props) {
 
  
  return (
    <div
      className="w-full lg:w-100 h-full flex flex-col bg-primary-card border border-primary-border"
    >
      <img
        src={props.team.image}
        alt={props.team.name}
        className=" object-cover "
      />
      <div className="flex flex-col text-center p-6">
            <h2 className="text-xl font-semibold">{props.team.name}</h2>
            <h2 className="text-xl mt-1 text-primary-light">{props.team.position}</h2>
      </div>
    </div>
  );
}

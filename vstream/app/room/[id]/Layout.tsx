export default function Layout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: { id: string }; // 🛑 Params automatically passed
  }) {
    return (
      <div>
        <h1>room: {params.id}</h1>
        {children}
        <div>
            <button onClick={()=>console.log("left")}>leave room</button>
        </div>
      </div>
    );
  }
  
class Waypoint {
    id
    sector
    system

    constructor(id) {
        this.id = id;
        this.sector = id.split("-")[0]
        this.system = id.split("-").slice(0, 2).join("-")
    }
}

export default Waypoint
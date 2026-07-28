import Link from "next/link";
import { Compass, Mountain } from "lucide-react";
import { plants, Habitat } from "@/data/plants";
import Chip from "@/components/ui/Chip";
import {
  getCategoryTone,
  getHabitatDotClass,
  getHabitatLabel,
} from "@/lib/utils";

interface HabitatInfo {
  id: Habitat;
  description: string;
  walkingDirections: string;
  terrain: string;
}

const HABITAT_INFO: HabitatInfo[] = [
  {
    id: "forest-floor",
    description:
      "The shaded understory beneath mature deciduous and mixed forest canopy. Rich in leaf litter and decaying organic matter, supporting a diverse community of spring ephemerals, ferns, and woodland wildflowers that bloom before the canopy closes.",
    walkingDirections:
      "From the main dormitory, walk south along the path behind the gym toward the Fay Athletic Facility. Continue into the wooded area behind the fields — the mature hardwood canopy begins within 200m. The forest floor is richest between March and May.",
    terrain: "Uneven leaf litter, root networks, moderate slope",
  },
  {
    id: "woodland-edge",
    description:
      "The transitional zone where forest meets open ground — along fencerows, path margins, and the borders of athletic fields. These edges support a mix of shade-tolerant forest species and sun-adapted shrubs and vines.",
    walkingDirections:
      "Woodland edges are found along the entire southern perimeter of the school property. Walk the trail that borders the soccer fields on the south side. The edge habitat is especially rich along the stone wall near the upper fields.",
    terrain: "Varied, may include stone walls, shrubby growth, fallen logs",
  },
  {
    id: "roadside",
    description:
      "Disturbed habitats along roadsides and paths support opportunistic native and invasive species. Often the best place to find common introduced plants and early colonizers of disturbed ground.",
    walkingDirections:
      "Walk along Marlboro Road (Route 85) on the school's east side. The road margins south toward the center of Southborough also yield many roadside species. Use caution near traffic.",
    terrain: "Compacted soil, gravel margins, occasional mow strips",
  },
  {
    id: "wetland",
    description:
      "Seasonally or permanently saturated ground supporting specialized moisture-tolerant plants including sedges, rushes, cattails, and large ferns. Critical habitat for amphibians and migratory birds.",
    walkingDirections:
      "Follow the trail from the back of Lower School dormitory northwest toward the seasonal drainage area. The low-lying area west of the baseball fields remains saturated through June. Rubber boots recommended in spring.",
    terrain: "Soft, saturated ground; standing water in spring",
  },
  {
    id: "pond-edge",
    description:
      "The margins of Chestnut Hill Pond and smaller water bodies support aquatic-edge specialists including cattails, pickerelweed, and moisture-loving ferns. Best accessed in summer when water levels are lower.",
    walkingDirections:
      "Take Chestnut Street west from campus for approximately 0.6km to reach Chestnut Hill Pond. The pond's northeast shore is accessible from the road margin. Always stay on publicly accessible land.",
    terrain: "Muddy banks, emergent vegetation, steep in places",
  },
  {
    id: "lawn-adjacent",
    description:
      "The mown and semi-mown margins of athletic fields and maintained lawns harbor disturbance-adapted plants — clovers, plantains, and early-successional wildflowers that tolerate periodic cutting.",
    walkingDirections:
      "The margins of all athletic fields and the main quad are lawn-adjacent habitat. Particularly rich in spring when dandelions and early wildflowers bloom before mowing resumes.",
    terrain: "Flat to gently sloped, mown grass with weedy margins",
  },
  {
    id: "rocky-outcrop",
    description:
      "Exposed bedrock outcrops of Milford Pink Granite support a specialized community of lichens, mosses, and stress-tolerant plants adapted to shallow, well-drained soils and high light conditions.",
    walkingDirections:
      "Several granite outcrops are visible along the ridge line northeast of the main campus, accessible via the cross-country trail that begins behind the science building. The largest outcrop is approximately 0.4km from the trailhead.",
    terrain: "Exposed rock, thin soil pockets, steep in places",
  },
  {
    id: "meadow",
    description:
      "Open sunny areas with tall grasses and forbs — goldenrods, asters, milkweeds, and other late-summer bloomers. Important habitat for pollinators and provides the best collecting from July through October.",
    walkingDirections:
      "The open area north of the school farm, accessible via the gravel path past the horse barn, supports a semi-managed meadow community. Best visited in August and September at peak bloom.",
    terrain: "Open, varied grass and forb height, may be brushy at margins",
  },
  {
    id: "streambank",
    description:
      "The banks of seasonal and perennial streams support moisture-loving plants including large ferns, cardinal flowers, and various sedges. Stream corridors also act as movement routes for wildlife.",
    walkingDirections:
      "Follow the drainage channel south of the main athletic complex. The intermittent stream flows year-round in the lower section where it crosses under Marlboro Road. The streambank habitat is richest in spring and early summer.",
    terrain: "Sloped, often undercut banks; wet in spring; watch footing",
  },
];

export default function HabitatsPage() {
  return (
    <div className="atlas-shell py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="section-label">Field conditions</p>
        <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          Habitats
        </h1>
        <p className="mt-3 text-sm text-text-soft">
          Plants grouped by habitat type, with walking directions from the school
          dormitory.
        </p>
      </div>

      {/* Quick jump links */}
      <div className="mb-8 flex flex-wrap gap-2">
        {HABITAT_INFO.map((h) => {
          const count = plants.filter((p) => p.habitat.includes(h.id)).length;
          return (
            <a
              key={h.id}
              href={`#${h.id}`}
              className="chip bg-surface text-text shadow-card transition-colors hover:bg-tint"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${getHabitatDotClass(h.id)}`}
                aria-hidden
              />
              {getHabitatLabel(h.id)}
              <span className="font-semibold text-moss">{count}</span>
            </a>
          );
        })}
      </div>

      {/* Habitat sections */}
      <div className="space-y-6">
        {HABITAT_INFO.map((habitatInfo) => {
          const habitatPlants = plants.filter((p) =>
            p.habitat.includes(habitatInfo.id)
          );

          return (
            <section
              key={habitatInfo.id}
              id={habitatInfo.id}
              className="card scroll-mt-24 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-tint/60 px-6 py-5">
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${getHabitatDotClass(habitatInfo.id)}`}
                    aria-hidden
                  />
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-text">
                      {getHabitatLabel(habitatInfo.id)}
                    </h2>
                    <p className="text-sm text-text-soft">
                      {habitatPlants.length} species documented
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
                {/* Description + Directions */}
                <div className="flex flex-col gap-4 lg:col-span-1">
                  <div>
                    <p className="section-label">About this habitat</p>
                    <p className="mt-2 text-sm leading-7 text-text">
                      {habitatInfo.description}
                    </p>
                  </div>

                  <div className="rounded-tile bg-moss-tint p-4">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-moss">
                      <Compass size={15} strokeWidth={1.8} />
                      Walking directions
                    </p>
                    <p className="mt-2 text-sm leading-7 text-text">
                      {habitatInfo.walkingDirections}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-text-soft">
                      <Mountain size={13} strokeWidth={1.8} className="flex-shrink-0" />
                      {habitatInfo.terrain}
                    </p>
                  </div>
                </div>

                {/* Species list */}
                <div className="lg:col-span-2">
                  <p className="section-label">Species found here</p>
                  {habitatPlants.length > 0 ? (
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {habitatPlants.map((plant) => (
                        <Link
                          key={plant.id}
                          href={`/plants/${plant.id}`}
                          className="group flex items-start gap-2.5 rounded-tile bg-canvas p-3 transition-colors hover:bg-tint"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold leading-tight text-text group-hover:text-moss">
                              {plant.commonName}
                            </p>
                            <p className="sci-name mt-0.5 truncate text-xs text-text-soft">
                              {plant.scientificName}
                            </p>
                          </div>
                          <Chip
                            tone={getCategoryTone(plant.category)}
                            className="flex-shrink-0 capitalize"
                          >
                            {plant.category}
                          </Chip>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-text-soft">
                      No species currently documented for this habitat.
                    </p>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

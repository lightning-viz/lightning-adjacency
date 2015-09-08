import org.viz.lightning._
import scala.util.Random

val lgn = Lightning()

val mat = Array.fill(10)(Array.fill(10)(Random.nextDouble()).map{ d =>
	if (d < 0.75) {
		d
	} else {
		0.0
	}
})
val group = Array.fill(10)(Random.nextInt)

lgn.adjacency(mat, group=group)

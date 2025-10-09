import SaleCountdown from "./Components/SaleCountdown"
import ProductBenefits from "./Components/ProductBenefits"
import FAQ from "../../components/FAQ"
import YouMayAlsoLike from "./Components/YouMayAlsoLike"

const ProductPage = () => {

  return (
    <div className="my-10">
      <YouMayAlsoLike />
      <SaleCountdown />
      <FAQ />
      <ProductBenefits />
    </div>
  )
}

export default ProductPage

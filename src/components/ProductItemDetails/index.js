import {Component} from 'react' // BsFillStarFill

import {BsPlusSquare, BsDashSquare, BsFillStarFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'

const apiConstents = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: [],
    similarProductDetails: [],
    count: 1,
    apiStatus: apiConstents.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  onClickIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onClickDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiConstents.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      console.log(response)
      const fetchedData = await response.json()
      console.log(fetchedData)
      const formattedData = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        price: fetchedData.price,
        rating: fetchedData.rating,
        style: fetchedData.style,
        title: fetchedData.title,
        totalReviews: fetchedData.total_reviews,
      }
      console.log(formattedData)
      const similarProductsFormattedData = fetchedData.similar_products.map(
        eachProduct => ({
          brand: eachProduct.brand,
          id: eachProduct.id,
          imageUrl: eachProduct.image_url,
          price: eachProduct.price,
          rating: eachProduct.rating,
          title: eachProduct.title,
        }),
      )
      console.log(similarProductsFormattedData)
      this.setState({
        productDetails: formattedData,
        similarProductDetails: similarProductsFormattedData,
        apiStatus: apiConstents.success,
      })
    } else {
      console.log(response)
      this.setState({apiStatus: apiConstents.failure})
    }
  }

  renderProductDetailsView = () => {
    const {productDetails, count} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productDetails
    return (
      <div className="product-details-container">
        <div className="product-details-card">
          <img className="product-img" src={imageUrl} alt="product" />
          <div>
            <h1 className="title1">{title}</h1>
            <p className="price1">Rs {price}/-</p>
            <div className="rating-card">
              <div className="rating1">
                <p>{rating}</p> <BsFillStarFill className="star" />
              </div>
              <p className="reviews1">{totalReviews} Reviews</p>
            </div>
            <p className="description1">{description}</p>
            <p className="status1">
              Available: <p className="available">{availability}</p>
            </p>
            <p className="brand1">
              Brand: <p className="brand11">{brand}</p>
            </p>
            <hr className="line" />
            <div className="counter-card">
              <button
                className="counter-btn"
                type="button"
                onClick={this.onClickDecrement}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p>{count}</p>
              <button
                className="counter-btn"
                type="button"
                onClick={this.onClickIncrement}
                data-testid="plus"
              >
                <BsPlusSquare className="" />
              </button>
            </div>
            <button className="cart-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {similarProductDetails} = this.state
    return similarProductDetails.map(eachProduct => (
      <li className="list-item" key={eachProduct.id}>
        <img
          className="product-img2"
          src={eachProduct.imageUrl}
          alt="similar product"
        />
        <h2 className="title-2">{eachProduct.title}</h2>
        <p>by {eachProduct.brand}</p>
        <div className="price-rating">
          <p>Rs {eachProduct.price}/-</p>
          <div className="ratings-card">
            <p>{eachProduct.rating}</p>
            <BsFillStarFill className="star" />
          </div>
        </div>
      </li>
    ))
  }

  renderSimilarProductsView = () => {
    console.log('fdsgfb')
    return (
      <div className="main-bottom-card">
        <div className="similar-products-container">
          <h2>Similar Products</h2>
          <div className="similar-products">{this.renderSimilarProducts()}</div>
        </div>
      </div>
    )
  }

  onClickShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => {
    console.log('fail')
    return (
      <>
        <Header />
        <div className="fail-card">
          <div className="failure-card">
            <img
              className="failure-img"
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
              alt="failure view"
            />
            <h1>Product Not Found</h1>
            <button
              className="fail-btn"
              type="button"
              onClick={this.onClickShopping}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <>
      <Header />
      <div data-testid="loader" className="primedeals-loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    </>
  )

  renderApiResponse = () => {
    console.log('apiRes')
    return (
      <>
        <Header />
        {this.renderProductDetailsView()}
        {this.renderSimilarProductsView()}
      </>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstents.inProgress:
        return this.renderLoadingView()
      case apiConstents.success:
        return this.renderApiResponse()
      case apiConstents.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}
export default ProductItemDetails

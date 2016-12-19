import React, { Component, PropTypes } from 'react';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import Link from 'react-router/lib/Link';
import Helmet from 'react-helmet';
import Segment from 'components/segment';
import connect from 'utils/connect';

@connect('planets')
export default class Planet extends Component {

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    planets: MobxPropTypes.observableObject,
  };

  componentWillMount() {
    const { planets } = this.props;
    const { id } = this.props.params;

    planets.fetchPlanets();
    planets.fetchPlanet(id);
  }

  diff = (a, b) => Math.abs(b.diameter - a.diameter);

  render() {
    const { planets } = this.props;
    const { id } = this.props.params;

    const planet = planets.getPlanet(id);

    return (
      <div>
        <Helmet title="Planet loading..." />
        <Segment>
          {planet.isLoading || planet.error ? (
            <div>
              {planet.error ? `Error fetching planet: ${planet.error.message}` : 'Loading planet'}
            </div>
          ) : (
            <div>
              <Helmet title={`Planet ${planet.data.name}`} />
              <h1>{planet.data.name}</h1>
              <ul>
                <li><strong>Gravity:</strong> {planet.data.gravity}</li>
                <li><strong>Terrain:</strong> {planet.data.terrain}</li>
                <li><strong>Climate:</strong> {planet.data.climate}</li>
                <li><strong>Population:</strong> {planet.data.population}</li>
                <li><strong>Diameter:</strong> {planet.data.diameter}</li>
              </ul>
              <Link to="/planets">Go back</Link>
              <hr />
              <div>
                <h3>Planets with similar diameter</h3>
                <ul>
                  {planets.isLoading ? (
                    <div>Loading similar planets</div>
                  ) : (
                    planets
                    .data
                    .filter(p => p.url !== planet.data.url)
                    .sort((a, b) => this.diff(a, planet.data) - this.diff(b, planet.data))
                    .slice(0, 3)
                    .map((relatedPlanet, i) => (
                      <li key={`related_${i}`}>{relatedPlanet.name} ({relatedPlanet.diameter})</li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
        </Segment>
      </div>
    );
  }
}

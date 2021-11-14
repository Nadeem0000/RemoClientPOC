import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RemoNewsCategoryBasedWebPartStrings';
import RemoNewsCategoryBased from './components/RemoNewsCategoryBased';
import { IRemoNewsCategoryBasedProps } from './components/IRemoNewsCategoryBasedProps';

export interface IRemoNewsCategoryBasedWebPartProps {
  description: string;
}

export default class RemoNewsCategoryBasedWebPart extends BaseClientSideWebPart<IRemoNewsCategoryBasedWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IRemoNewsCategoryBasedProps> = React.createElement(
      RemoNewsCategoryBased,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

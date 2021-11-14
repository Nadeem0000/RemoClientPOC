import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RemoGalleryVmWebPartStrings';
import RemoGalleryVm from './components/RemoGalleryVm';
import { IRemoGalleryVmProps } from './components/IRemoGalleryVmProps';

export interface IRemoGalleryVmWebPartProps {
  description: string;
}

export default class RemoGalleryVmWebPart extends BaseClientSideWebPart<IRemoGalleryVmWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IRemoGalleryVmProps> = React.createElement(
      RemoGalleryVm,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient
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
